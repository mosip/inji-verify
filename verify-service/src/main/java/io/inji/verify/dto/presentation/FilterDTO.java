package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FilterDTO {
    String type;
    String pattern;
}