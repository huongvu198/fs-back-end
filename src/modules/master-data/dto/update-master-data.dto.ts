import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class UpdateMasterDataDto {
  @ApiProperty({
    example: '97129312',
    maxLength: 255,
    required: true,
    type: String,
  })
  @IsString()
  _id: string;

  @ApiProperty({
    example: {
      dayExpired: 180,
      dayShowExpire: 7,
    },
    required: true,
    type: Object,
  })
  @IsObject()
  data: any;
}
