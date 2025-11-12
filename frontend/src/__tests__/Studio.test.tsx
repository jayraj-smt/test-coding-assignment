import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Studio from '../pages/Studio';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { generationService } from '../services/generationService';

vi.mock('../services/generationService', () => ({
  generationService: {
    getRecentGenerations: vi.fn(),
    createGeneration: vi.fn(),
  },
}));

const renderStudio = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Studio />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Studio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(generationService.getRecentGenerations).mockResolvedValue([]);
  });

  it('renders generation form', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

    renderStudio();

    await waitFor(() => {
      expect(screen.getByText(/create new generation/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/style/i)).toBeInTheDocument();
  });

  it('shows generate button', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

    renderStudio();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    });
  });

  it('disables generate button when no image or prompt', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

    renderStudio();

    await waitFor(() => {
      const generateButton = screen.getByRole('button', { name: /generate/i });
      expect(generateButton).toBeDisabled();
    });
  });
});
