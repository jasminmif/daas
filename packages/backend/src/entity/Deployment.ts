import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Application } from './Application';
import { ContainerGroup } from './ContainerGroup';
import { BaseEntity } from './BaseEntity';
import { Lazy } from '../types';

@Entity()
@ObjectType()
export class Deployment extends BaseEntity {
    static findByApplicationAndId(application: Application, id: number) {
        return Deployment.findOneOrFail({
            where: {
                id,
                application
            }
        });
    }

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    // TODO: When you specify the image, we should attempt to resolve it against our
    // registry so that we can verify that this will be "launchable".
    @Field()
    @Column()
    image!: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @ManyToOne(
        () => Application,
        application => application.containerGroups,
        { lazy: true }
    )
    application!: Lazy<Application>;

    @Field(() => [ContainerGroup])
    @OneToMany(
        () => ContainerGroup,
        containerGroup => containerGroup.deployment,
        { lazy: true }
    )
    containerGroups!: Lazy<ContainerGroup[]>;
}
