package io.inji.verify.dto.submission;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class  PresentationSubmissionDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @NotNull(message = "Presentation Submission ID cannot be null")
    @NotBlank(message = "Presentation Submission ID cannot be blank")
    @NotEmpty(message = "Presentation Submission ID cannot be empty")
    private String id;
    @NotNull(message = "Definition ID cannot be null")
    @NotBlank(message = "Definition ID cannot be null")
    @NotEmpty(message = "Definition ID cannot be null")
    @JsonProperty("definition_id")
    @SerializedName("definition_id")
    private String definitionId;
    @NotNull(message = "Descriptor Map cannot be null")
    @JsonProperty("descriptor_map")
    @SerializedName("descriptor_map")
    private List<DescriptorMapDto> descriptorMap;
}
