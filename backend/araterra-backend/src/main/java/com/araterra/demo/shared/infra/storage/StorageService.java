package com.araterra.demo.shared.infra.storage;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

public interface StorageService {

    String save(MultipartFile file, String folder);

    void delete(String path);

    Resource load(String path);
}