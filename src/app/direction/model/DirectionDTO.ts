export class DirectionDTO {
    nom_direction: string;
    siteIds: number[];

    constructor(nom_direction: string, siteIds: number[]) {
        this.nom_direction = nom_direction;
        this.siteIds = siteIds;
    }
}
