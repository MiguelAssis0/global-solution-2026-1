package com.araterra.demo.auth.internal.entities.enums;

public enum Roles {
    USER(1),
    ADMIN(2);

    private final int id;

    Roles(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
