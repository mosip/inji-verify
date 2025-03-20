package io.inji.verify.dto.submission;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@AllArgsConstructor
@Getter
public class  PresentationSubmissionDto {
    @NotNull(message = "Presentation Submission ID cannot be null")
    @NotBlank(message = "Presentation Submission ID cannot be blank")
    @NotEmpty(message = "Presentation Submission ID cannot be empty")
    String id;
    @NotNull(message = "Definition ID cannot be null")
    @NotBlank(message = "Definition ID cannot be null")
    @NotEmpty(message = "Definition ID cannot be null")
    @JsonProperty("definition_id")
    @SerializedName("definition_id")
    String definitionId;
    @NotNull(message = "Descriptor Map cannot be null")
    @JsonProperty("descriptor_map")
    @SerializedName("descriptor_map")
    List<DescriptorMapDto> descriptorMap;
}
