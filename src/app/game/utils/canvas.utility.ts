export interface DrawOptions {
  stroke?: boolean;
  line_width?: number;
  line_color?: string;
  fill?: boolean;
  fill_color?: string;
  shadow_blur?: number;
  shadow_color?: string;
  text_align?: CanvasTextAlign;
  text_valign?: CanvasTextBaseline;
  font?: string;
}

export class CanvasUtility {

  public static circle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, options: DrawOptions = {}) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    CanvasUtility.draw(context, options);
  }

  public static rect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, options: DrawOptions = {}) {
    context.beginPath();
    context.rect(x, y, width, height);
    CanvasUtility.draw(context, options);
  }

  public static roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, options: DrawOptions = {}) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    CanvasUtility.draw(context, options);
  }

  public static text(context: CanvasRenderingContext2D, text: string, x: number, y: number, options: DrawOptions = {}) {
    if (options.line_width) {
      context.lineWidth = 2;
    }
    if (options.text_align) {
      context.textAlign = options.text_align;
    }
    if (options.text_valign) {
      context.textBaseline = options.text_valign;
    }
    if (options.font) {
      context.font = options.font;
    }
    if (options.line_color) {
      context.strokeStyle = options.line_color;
    }
    context.strokeText(text, x, y);
    CanvasUtility.reset(context);
  }

  public static image(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, path: string, options: DrawOptions = {}, callback: () => void = () => null) {
    const figure = new Image(width, height);
    if (options.shadow_blur) {
      context.shadowBlur = options.shadow_blur;
      if (options.shadow_color) {
        context.shadowColor = options.shadow_color;
      }
    }
    figure.onload = () => {
      context.drawImage(figure, x, y, width, height);
      CanvasUtility.reset(context);
      callback();
    };
    figure.src = path;
  }

  public static toDataURL(src: string, callback: (dataURL: string) => void) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      callback(canvas.toDataURL());
    };
    img.src = src;
  }

  private static draw(context: CanvasRenderingContext2D, options: DrawOptions = {}) {
    if (options.line_width) {
      context.lineWidth = options.line_width;
    }
    if (options.stroke) {
      if (options.line_color) {
        context.strokeStyle = options.line_color as string;
      }
      context.stroke();
    }
    if (options.fill) {
      if (options.fill_color) {
        context.fillStyle = options.fill_color as string;
      }
      context.fill();
    }

    if (options.shadow_blur) {
      context.shadowBlur = 20;
      if (options.shadow_color) {
        context.shadowColor = options.shadow_color;
      }
    }
    CanvasUtility.reset(context);
  }

  private static reset(context: CanvasRenderingContext2D) {
    context.shadowBlur = 0;
    context.shadowColor = 'transparent';
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
    context.lineWidth = 1;
  }

}
