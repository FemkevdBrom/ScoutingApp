package nl.fontys.fsd.backend.dto;

public record GroupCardDTO (
        long id,
        String name,
        String description,
        String colorHex
){ }
