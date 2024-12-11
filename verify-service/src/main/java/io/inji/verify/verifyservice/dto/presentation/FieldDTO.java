package io.inji.verify.verifyservice.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldDTO {
    String[] path;
    FilterDTO filter;
}
