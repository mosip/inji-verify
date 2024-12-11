package io.inji.verify.verifyservice.dto.submission;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseAcknowledgementDto {
    String redirectUri;
    String error;
    String errorDescription;
}
