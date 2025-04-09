import { Employe } from "../../employe/model/employe";
import { SousTypeFormation } from "./SousTypeFormation.model";
import { TypeFormation } from "./type-formation.model";

export interface FormationDto {
    titre: string;
    description: string;
    typeFormation: TypeFormation;
    sousTypeFormation: SousTypeFormation;
    dateDebutPrevue: string; // Utilisation de string pour les dates (format ISO 8601)
    dateFinPrevue: string;
    responsableEvaluationId?: number; // Optionnel
    responsableEvaluationExterne?: string; // Optionnel
    employeIds: number[];
    responsableEvaluation?: string;
    employes?: Employe[]; 
  }