import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DisposalPoint } from '../../disposal-points/schemas/disposal-point.schema';

export type DisposalRecordDocument = HydratedDocument<DisposalRecord>;

@Schema()
export class DisposalRecord {
  @Prop({ required: true })
  userName: string;

  @Prop({ type: Types.ObjectId, ref: 'DisposalPoint', required: true })
  disposalPoint: DisposalPoint;

  @Prop({
    required: true,
    enum: ['plastic', 'paper', 'organic', 'electronic', 'glass', 'other'],
  })
  wasteType: string;

  @Prop({ default: Date.now, index: true })
  date: Date;

  // Campo calculado automaticamente para facilitar o relatório mensal
  @Prop()
  recordMonthYear: string;
}

export const DisposalRecordSchema =
  SchemaFactory.createForClass(DisposalRecord);

// Lógica automática: Antes de salvar, preenche o mês/ano
DisposalRecordSchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    this.recordMonthYear = `${d.getFullYear()}-${month}`;
  }
  next();
});
