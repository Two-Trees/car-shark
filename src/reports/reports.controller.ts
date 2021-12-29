import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Patch, 
    Param, 
    Get, 
    Query
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto'
import { ReportsService }  from './reports.service'
import { AuthGuard } from  '../guards/auth.guards'
import { CurrentUser } from '../users/decorators/current-user.decorators'
import { User } from 'src/users/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import {  GetEstimateDto } from './dto/get-estimate.dto';
// import { GetMakeDto } from './dto/get-make.dto';


@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    // @Get()
    // getMake(@Query() query: GetMakeDto){

    // }

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        return this.reportsService.getMake(query)
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
        return this.reportsService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        return this.reportsService.approvalStatus(id, body.approved)
    }

    // @Get('/:make')
    // @UseGuards(AdminGuard)
    // updateMake(@Param('make') make: string, @Body() body: ApproveReportDto){
    //     // return this.reportsService.approvalStatus(make, body.approved)
    // }
    
}
