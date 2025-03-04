export class PosteDTO {
    titre: string;
    niveauExperience: string;
    diplomeRequis: string;
    competencesRequises: string;
    directionIds: number[];  // Liste des IDs des directions associées
  
    constructor(
      titre: string,
      niveauExperience: string,
      diplomeRequis: string,
      competencesRequises: string,
      directionIds: number[]
    ) {
      this.titre = titre;
      this.niveauExperience = niveauExperience;
      this.diplomeRequis = diplomeRequis;
      this.competencesRequises = competencesRequises;
      this.directionIds = directionIds;
    }
  }
  