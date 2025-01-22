package io.inji.verify.dto.submission;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@AllArgsConstructor
@Getter
public class PresentationSubmissionDto {
    String id;
    @JsonProperty("definition_id")
    @SerializedName("definition_id")
    String definitionId;
    @JsonProperty("descriptor_map")
    @SerializedName("descriptor_map")
    List<DescriptorMapDto> descriptorMap;
}
