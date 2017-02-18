export function getFirstValidImageFromFiles(files: FileList): File | null
{
  for (let i = 0; i < files.length; i++)
  {
    const file = files[i];
    if (file.type.indexOf("image") !== -1)
    {
      return file;
    }
  }

  return null;
}

export function getHTMLImageElementFromDataTransfer(
  dataTransfer: DataTransfer,
  onComplete: (image: HTMLImageElement) => void,
  onError?: (errorType: "noImage" | "couldntLoad", errorEvent?: ErrorEvent) => void,
): void
{
  const htmlContent = dataTransfer.getData("text/html");
  const imageSourceMatches = htmlContent ? htmlContent.match(/src\s*=\s*"(.+?)"/) : null;
  const imageSource = imageSourceMatches ? imageSourceMatches[1] : null;

  if (!imageSource)
  {
    if (onError)
    {
      onError("noImage");
    }

    return null;
  }

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = e =>
  {
    onComplete(img);
  };
  img.onerror = e =>
  {
    onError("couldntLoad", e);
  };

  img.src = imageSource;

  // image was cached
  if (img.complete || img.complete === undefined)
  {
    onComplete(img);
  }
}

