package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FieldDTO {
    String[] path;
    FilterDTO filter;
}
