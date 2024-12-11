package io.inji.verify.dto.submission;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DescriptorMapDto {
    String id;
    String format;
    String path;
    @JsonProperty("path_nested")
    @SerializedName("path_nested")
    PathNestedDto pathNested;
}
