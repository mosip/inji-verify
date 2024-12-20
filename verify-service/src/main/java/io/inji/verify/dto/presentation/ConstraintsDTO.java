package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;


@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConstraintsDTO {
    FieldDTO[] fields;
}