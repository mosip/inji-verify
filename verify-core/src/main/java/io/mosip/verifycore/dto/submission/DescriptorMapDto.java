package io.mosip.verifycore.dto.submission;


import com.fasterxml.jackson.annotation.JsonProperty;
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
    PathNestedDto pathNested;
}
