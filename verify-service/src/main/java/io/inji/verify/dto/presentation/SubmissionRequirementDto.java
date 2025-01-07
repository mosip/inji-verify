package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionRequirementDto {
    String name;
    String rule;
    String count;
    String from;
}

