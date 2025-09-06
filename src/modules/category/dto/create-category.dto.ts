import { CategoryTags } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    name: string;
    @IsOptional()
    tag: CategoryTags;
}
