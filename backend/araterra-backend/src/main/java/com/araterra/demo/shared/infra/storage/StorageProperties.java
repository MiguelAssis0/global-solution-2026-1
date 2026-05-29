package com.araterra.demo.shared.infra.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public record StorageProperties(
        String rootDir,
        Integer avatarMaxSizeMb
) {}