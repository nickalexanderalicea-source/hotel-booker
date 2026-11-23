PRAGMA foreign_keys = ON;

CREATE TABLE users (
    user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name     VARCHAR(200) NOT NULL,
    email         VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(20),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE hotels (
    hotel_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_name  VARCHAR(150) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100),
    country     VARCHAR(100) NOT NULL,
    address     VARCHAR(255),
    description TEXT,
    star_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (star_rating BETWEEN 0 AND 5),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE rooms (
    room_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id    INTEGER NOT NULL,
    room_type   VARCHAR(50) NOT NULL,
    capacity    INTEGER NOT NULL CHECK (capacity > 0),
    size        INTEGER CHECK (size > 0),
    price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    room_status VARCHAR(20) NOT NULL DEFAULT 'available',
    image_url   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE RESTRICT
);


CREATE TABLE amenities (
    amenity_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    amenity_name VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE hotel_amenities (
    hotel_id   INTEGER NOT NULL,
    amenity_id INTEGER NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);


CREATE TABLE favorites (
    user_id    INTEGER NOT NULL,
    hotel_id   INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, hotel_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    booking_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL,
    room_id             INTEGER NOT NULL,
    check_in_date       DATE NOT NULL,
    check_out_date      DATE NOT NULL,
    number_of_guests    INTEGER NOT NULL CHECK (number_of_guests > 0),
    total_nights        INTEGER NOT NULL CHECK (total_nights > 0),
    total_price         DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    booking_status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (booking_status IN ('pending', 'confirmed', 'canceled', 'completed')),
    confirmation_number VARCHAR(50) NOT NULL UNIQUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out_date > check_in_date),
    CHECK (total_nights = julianday(check_out_date) - julianday(check_in_date)),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT
);


-- Regla 7: el número de huéspedes no puede exceder la capacidad de la habitación.
CREATE TRIGGER trg_guests_within_capacity_insert
BEFORE INSERT ON bookings
BEGIN
    SELECT RAISE(ABORT, 'Guest count exceeds room capacity.')
    WHERE NEW.number_of_guests > (SELECT capacity FROM rooms WHERE room_id = NEW.room_id);
END;

CREATE TRIGGER trg_guests_within_capacity_update
BEFORE UPDATE OF room_id, number_of_guests ON bookings
BEGIN
    SELECT RAISE(ABORT, 'Guest count exceeds room capacity.')
    WHERE NEW.number_of_guests > (SELECT capacity FROM rooms WHERE room_id = NEW.room_id);
END;


-- Reglas 11 y 12: una habitación no puede tener dos reservas activas
-- (pending o confirmed) con fechas que se solapen. Las canceladas no bloquean.
-- Requiere que bookings tenga la columna booking_status.

CREATE TRIGGER trg_no_room_overlap_insert
BEFORE INSERT ON bookings
WHEN NEW.booking_status IN ('pending', 'confirmed')
BEGIN
    SELECT RAISE(ABORT, 'The selected room is already booked for those dates.')
    WHERE EXISTS (
        SELECT 1
        FROM bookings b
        WHERE b.room_id = NEW.room_id
          AND b.booking_status IN ('pending', 'confirmed')
          AND NEW.check_in_date  < b.check_out_date
          AND NEW.check_out_date > b.check_in_date
    );
END;

-- Mismo control al modificar una reserva (cambiar fechas, habitación,
-- o reactivar una cancelada). Se excluye a sí misma de la comparación.
CREATE TRIGGER trg_no_room_overlap_update
BEFORE UPDATE OF room_id, check_in_date, check_out_date, booking_status ON bookings
WHEN NEW.booking_status IN ('pending', 'confirmed')
BEGIN
    SELECT RAISE(ABORT, 'The selected room is already booked for those dates.')
    WHERE EXISTS (
        SELECT 1
        FROM bookings b
        WHERE b.room_id = NEW.room_id
          AND b.booking_id <> NEW.booking_id
          AND b.booking_status IN ('pending', 'confirmed')
          AND NEW.check_in_date  < b.check_out_date
          AND NEW.check_out_date > b.check_in_date
    );
END;

CREATE TABLE payments (
    payment_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id      INTEGER NOT NULL UNIQUE,
    cardholder_name VARCHAR(100) NOT NULL,
    card_last_four  CHAR(4) NOT NULL
                    CHECK (card_last_four GLOB '[0-9][0-9][0-9][0-9]'),
    payment_method  VARCHAR(50) NOT NULL,
    payment_amount  DECIMAL(10,2) NOT NULL CHECK (payment_amount > 0),
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'approved'
                    CHECK (payment_status IN ('pending', 'approved', 'declined')),
    payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE RESTRICT
);


-- Regla 18: el monto del pago debe ser igual al total de la reserva.
CREATE TRIGGER trg_payment_matches_total_insert
BEFORE INSERT ON payments
BEGIN
    SELECT RAISE(ABORT, 'Payment amount must equal the booking total.')
    WHERE NEW.payment_amount <> (SELECT total_price FROM bookings WHERE booking_id = NEW.booking_id);
END;

CREATE TRIGGER trg_payment_matches_total_update
BEFORE UPDATE OF booking_id, payment_amount ON payments
BEGIN
    SELECT RAISE(ABORT, 'Payment amount must equal the booking total.')
    WHERE NEW.payment_amount <> (SELECT total_price FROM bookings WHERE booking_id = NEW.booking_id);
END;


-- Regla 17: una reserva no puede quedar confirmada (ni completada) sin un pago aprobado.
-- Flujo esperado: crear la reserva como 'pending' -> registrar el pago -> cambiarla a 'confirmed'.
CREATE TRIGGER trg_confirm_requires_payment_insert
BEFORE INSERT ON bookings
WHEN NEW.booking_status IN ('confirmed', 'completed')
BEGIN
    SELECT RAISE(ABORT, 'A booking cannot be confirmed without an approved payment.');
END;

CREATE TRIGGER trg_confirm_requires_payment_update
BEFORE UPDATE OF booking_status ON bookings
WHEN NEW.booking_status IN ('confirmed', 'completed')
BEGIN
    SELECT RAISE(ABORT, 'A booking cannot be confirmed without an approved payment.')
    WHERE NOT EXISTS (
        SELECT 1
        FROM payments p
        WHERE p.booking_id = NEW.booking_id
          AND p.payment_status = 'approved'
    );
END;


CREATE TABLE reviews (
    review_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    hotel_id   INTEGER NOT NULL,
    rating     INTEGER NOT NULL
               CHECK (rating BETWEEN 1 AND 5 AND rating = CAST(rating AS INTEGER)),
    comment    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE RESTRICT
);


-- Regla 23: el usuario solo puede reseñar un hotel después de completar una reserva en él.
CREATE TRIGGER trg_review_requires_completed_stay
BEFORE INSERT ON reviews
BEGIN
    SELECT RAISE(ABORT, 'You can only review a hotel after completing a stay there.')
    WHERE NOT EXISTS (
        SELECT 1
        FROM bookings b
        JOIN rooms r ON b.room_id = r.room_id
        WHERE b.user_id = NEW.user_id
          AND r.hotel_id = NEW.hotel_id
          AND b.booking_status = 'completed'
    );
END;

-- Regla 24: la reseña puede cambiar su calificación y comentario,
-- pero no el usuario ni el hotel a los que pertenece.
CREATE TRIGGER trg_review_identity_locked
BEFORE UPDATE OF user_id, hotel_id ON reviews
WHEN NEW.user_id <> OLD.user_id OR NEW.hotel_id <> OLD.hotel_id
BEGIN
    SELECT RAISE(ABORT, 'A review cannot change its user or hotel.');
END;
