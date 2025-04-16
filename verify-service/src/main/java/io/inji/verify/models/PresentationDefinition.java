package io.inji.verify.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.shared.Constants;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Table(name = "presentation_definition")
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class PresentationDefinition {
    @Id
    @Column(name="id")
    private final String id;

    @Column(columnDefinition = "json", name="input_descriptors")
    @JdbcTypeCode(SqlTypes.JSON)
    private final List<InputDescriptorDto> inputDescriptors;

    @Column(name="name")
    private String name;

    @Column(name="purpose")
    private String purpose;


    @Column(columnDefinition = "json", name="submission_requirements")
    @JdbcTypeCode(SqlTypes.JSON)
    private final List<SubmissionRequirementDto> submissionRequirements;

    @JsonIgnore
    public String getURL(){
        return Constants.VP_DEFINITION_URI +this.id;
    }

}