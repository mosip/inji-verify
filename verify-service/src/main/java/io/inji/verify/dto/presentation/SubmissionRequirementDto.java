package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.AllArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionRequirementDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private final String name;
    private final String rule;
    private final String count;
    private final String from;
}

