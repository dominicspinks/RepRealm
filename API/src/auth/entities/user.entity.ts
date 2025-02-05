import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    fullName?: string;

    @Field()
    createdAt: Date;

    @Field({ nullable: true })
    updatedAt?: Date;
}
