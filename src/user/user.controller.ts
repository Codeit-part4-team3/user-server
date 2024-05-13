import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StateDto } from './../dto/state.dto';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';
import { failToken, unauthorized } from './../auth/api-response/tokenResponse';
import {
  MyInfoGet,
  MyStateGet,
  MyStatePut,
} from '../decorators/userDecorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfoDto } from '../dto/userInfo.dto';
import { AdminGuard } from 'src/auth/admin-guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@unauthorized
@failToken
@ApiTags('user')
@Controller('/user/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.upload(file);
  }

  @MyInfoGet('me')
  async getUser(@Request() request) {
    return await this.userService.getUserById(request.userId);
  }

  @Put('me/update')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateUser(
    @Request() request,
    @Body()
    userInfoDto: UserInfoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    imageFile: Express.Multer.File, // Add @Optional() decorator to allow null
  ) {
    return await this.userService.updateUserInfo(
      request.userId,
      userInfoDto,
      imageFile,
    );
  }

  @MyStateGet('me/state')
  async getState(@Request() request) {
    return await this.userService.getState(request.userId);
  }

  @MyStatePut('me/state/update')
  async changeState(@Request() request, @Body() stateDto: StateDto) {
    return await this.userService.changeState(request.userId, stateDto);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }
}
