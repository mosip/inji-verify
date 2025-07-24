package io.inji.verify.dto.submission;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
public class DescriptorMapDto implements Serializable {
    public DescriptorMapDto() {
    }

    @Serial
    private static final long serialVersionUID = 1L;
    String id;
    String format;
    String path;
    @JsonProperty("path_nested")
    @SerializedName("path_nested")
    PathNestedDto pathNested;
}
