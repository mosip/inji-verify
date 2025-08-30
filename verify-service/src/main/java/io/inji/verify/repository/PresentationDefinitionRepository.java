package io.inji.verify.repository;

import io.inji.verify.models.PresentationDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresentationDefinitionRepository extends JpaRepository<PresentationDefinition, String> { }