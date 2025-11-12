import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ImageUpload from '../components/ImageUpload';
import * as imageResize from '../utils/imageResize';

vi.mock('../utils/imageResize');

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock resizeImage to return the file as-is by default
    vi.mocked(imageResize.resizeImage).mockImplementation(async (file) => file);
  });
  it('renders upload area', () => {
    const onImageSelect = vi.fn();
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={null} />);

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it('shows preview when image is provided', () => {
    const onImageSelect = vi.fn();
    const previewUrl = 'data:image/jpeg;base64,test';
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={previewUrl} />);

    const img = screen.getByAltText('Preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', previewUrl);
  });

  it('calls onImageSelect when file is selected', async () => {
    const onImageSelect = vi.fn();
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={null} />);

    // Create a valid JPEG file - ensure it passes validation
    const file = new File(['fake image data'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    // Use fireEvent to directly trigger the change event
    fireEvent.change(input, {
      target: { files: [file] },
    });

    // Wait for async image resizing to complete
    await waitFor(
      () => {
        expect(onImageSelect).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    expect(onImageSelect).toHaveBeenCalledWith(expect.any(File));
  });

  it('is disabled when disabled prop is true', () => {
    const onImageSelect = vi.fn();
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={null} disabled={true} />);

    const input = screen.getByLabelText('File input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
