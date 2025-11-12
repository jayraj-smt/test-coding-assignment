import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../components/ImageUpload';

describe('ImageUpload', () => {
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
    const user = userEvent.setup();
    const onImageSelect = vi.fn();
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={null} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    await user.upload(input, file);

    expect(onImageSelect).toHaveBeenCalledWith(file);
  });

  it('is disabled when disabled prop is true', () => {
    const onImageSelect = vi.fn();
    render(<ImageUpload onImageSelect={onImageSelect} previewUrl={null} disabled={true} />);

    const input = screen.getByLabelText('File input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
