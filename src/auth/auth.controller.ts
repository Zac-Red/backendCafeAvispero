import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';
import { QueryParamsUserDto } from './dto/query-params-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @Auth( ValidRoles.SuperUser)
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('seed')
  seeduser(){
    return this.authService.seedusercreate();
  }

  @Get()
  @Auth( ValidRoles.SuperUser )
  findAll(@Query() queryparams: QueryParamsUserDto) {
    return this.authService.findAll(queryparams);
  }

  @Get(':term')
  @Auth( ValidRoles.SuperUser )
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch(':id')
  @Auth( ValidRoles.SuperUser )
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.SuperUser )
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

}
