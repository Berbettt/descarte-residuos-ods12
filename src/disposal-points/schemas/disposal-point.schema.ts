import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DisposalPointDocument = HydratedDocument<DisposalPoint>;

@Schema({ timestamps: true })
export class DisposalPoint {
  @Prop({ required: true, index: true }) // Indexado para busca rápida
  name: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true, enum: ['public', 'private'] })
  locationType: string;

  @Prop({ type: [String], required: true })
  acceptedCategories: string[];

  // GeoLocation conforme pedido no documento
  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
    _id: false,
  })
  geoLocation: {
    lat: number;
    lng: number;
  };
}

export const DisposalPointSchema = SchemaFactory.createForClass(DisposalPoint);
DisposalPointSchema.index({ geoLocation: '2dsphere' });
