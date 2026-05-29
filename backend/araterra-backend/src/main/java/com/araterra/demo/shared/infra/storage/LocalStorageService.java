package com.araterra.demo.shared.infra.storage;

import com.araterra.demo.shared.infra.exceptions.StorageException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {

    private final StorageProperties properties;

    @Override
    public String save(MultipartFile file, String folder) {

        validate(file);

        try {
            String extension = getExtension(file);

            String fileName = UUID.randomUUID() + "." + extension;

            Path uploadDir = Paths.get(
                    properties.rootDir(),
                    folder
            );

            Files.createDirectories(uploadDir);

            Path target = uploadDir.resolve(fileName);

            file.transferTo(target);

            return folder + "/" + fileName;

        } catch (IOException e) {
            throw new StorageException("Failed to save file", e);
        }
    }

    @Override
    public void delete(String path) {
        try {
            Path filePath = Paths.get(properties.rootDir(), path);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file", e);
        }
    }

    @Override
    public Resource load(String path) {
        Path filePath = Paths.get(properties.rootDir(), path);
        return new FileSystemResource(filePath);
    }

    private void validate(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty");
        }

        if (file.getSize() >
                properties.avatarMaxSizeMb() * 1024L * 1024L) {
            throw new StorageException("File too large");
        }

        String type = file.getContentType();

        List<String> allowed = List.of(
                "image/png",
                "image/jpeg",
                "image/webp"
        );

        if (type == null || !allowed.contains(type)) {
            throw new StorageException("Invalid file type");
        }
    }

    private String getExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null || !name.contains(".")) {
            return "bin";
        }
        return name.substring(name.lastIndexOf(".") + 1);
    }
}