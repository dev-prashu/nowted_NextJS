'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ 
  type, 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: type === 'sign-up' ? name : undefined, email, password });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 8,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        {type === 'sign-up' && (
          <TextField
            label="Name"
            value={name}
            fullWidth
            required
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          fullWidth
          required
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          fullWidth
          required
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            type === 'sign-in' ? 'Sign In' : 'Sign Up'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthForm;