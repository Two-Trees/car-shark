import {
    UseInterceptors, 
    NestInterceptor, 
    ExecutionContext, 
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

interface ClassConstructor { 
    new (...args: any[]): {};
}

//add type safety interfaces for other params

export function Serialize(dto: ClassConstructor){ 
    return UseInterceptors(new SerializeInterceptor(dto))
} 

// implements satisifies the requirements of a interface
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // executes before request is handles by request handler
        return handler.handle().pipe(
            map((data: any) => {
                // executes before response data is sent out
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }

}