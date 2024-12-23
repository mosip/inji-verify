package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.enums.SubmissionState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusDto {
    SubmissionState status;
}