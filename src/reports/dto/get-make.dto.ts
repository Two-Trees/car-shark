import { IsString } from 'class-validator'

export class GetMakeDto {    
    @IsString()
    make: string;

}