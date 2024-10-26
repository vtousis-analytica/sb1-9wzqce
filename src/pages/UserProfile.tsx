import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Shield, FileText, Calendar, CheckCircle, Edit2, Key, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import type { User } from '../types/user';

// Rest of the file remains the same...