export class Employe {
  id!:number;
  nom!: string;
  prenom!: string;
  matricule!: number;
  dateNaissance!: Date;
  dateRecrutement!: Date;
  email!: string;
 
  direction?: string;
  site?: string;
  sexe!: string;
  actif!: boolean; // <-- Changement ici (boolean)
 photo!:string ;
 resultat?: string; // Résultat de la formation
 res?: boolean; // Propriété res
  constructor(data?: Partial<Employe>) {
    Object.assign(this, data);
  }
}
