import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'rawmaterial_images' })
export class RawMaterialImage{

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  // @ManyToOne(
  //   () => Rawmaterial,
  //   (rawmaterial) => rawmaterial.images,
  //   { onDelete: 'CASCADE'}
  // )
  // rawmaterial: Rawmaterial
}