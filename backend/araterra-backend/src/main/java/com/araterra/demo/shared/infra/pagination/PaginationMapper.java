package com.araterra.demo.shared.infra.pagination;

import com.araterra.demo.shared.infra.pagination.PageResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PaginationMapper {

    public <T> PageResponseDTO<T> toDTO(
            Page<T> page
    ) {

        return new PageResponseDTO<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}