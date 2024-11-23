package io.mosip.verifycore.dto.submission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationSubmissionDto {
    String id;
    @JsonProperty("definition_id")
    String definitionId;
    @JsonProperty("descriptor_map")
    List<DescriptorMapDto> descriptorMap;
}
