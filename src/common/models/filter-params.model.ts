import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class FilterParams {
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    limit: number;

}