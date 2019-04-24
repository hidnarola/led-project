import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform (images: any[], searchText: string ): any[] {
        if (!images || !searchText) {
            return images;
        }
        console.log(images);
        
        return images.filter(image => (image.value.toLowerCase().indexOf(searchText.toLowerCase())) !== -1);
    }
}
