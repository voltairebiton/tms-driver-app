import { NgModule } from '@angular/core';
import { TimestampPipe } from './timestamp/timestamp';
@NgModule({
	declarations: [TimestampPipe],
	imports: [],
	exports: [TimestampPipe]
})
export class PipesModule {}
