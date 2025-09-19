import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, ArrowRight, LogOut, Mic, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed";
  progress: number;
  createdAt: string;
  lastModified: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to sign in if not authenticated
      navigate('/signin');
    }
  }, [navigate]);

  // Open New Project modal if requested via navigation state
  useEffect(() => {
    if ((location.state as any)?.openNewProject) {
      setShowNewProjectModal(true);
      // Clear the state flag to avoid reopening on back/forward
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:changed'));
    navigate('/');
  };
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Eco T-Shirt Brand",
      description: "Sustainable fashion startup targeting eco-conscious millennials",
      status: "active",
      progress: 75,
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: "2",
      name: "Local Coffee Shop",
      description: "Artisanal coffee shop in downtown area",
      status: "draft",
      progress: 25,
      createdAt: "2024-01-10",
      lastModified: "2024-01-12",
    },
  ]);

  const handleCreateProject = async (idea: string) => {
    if (!idea.trim()) return;
    
    setIsCreatingProject(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: idea.split(" ").slice(0, 3).join(" ") + " Business",
      description: idea,
      status: "draft",
      progress: 10,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    };
    
    setProjects(prev => [newProject, ...prev]);
    setShowNewProjectModal(false);
    setIsCreatingProject(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    console.log("Project created successfully:", newProject.name);
  };

  const resetNewProjectForm = () => {
    setShowNewProjectModal(false);
    setIsCreatingProject(false);
  };

  const handleOpenProject = (project: Project) => {
    // Navigate to the main dashboard with the selected project
    navigate("/", { state: { selectedProject: project } });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  function NewProjectModal() {
    const [ideaText, setIdeaText] = useState("");
    const [category, setCategory] = useState("Clothing");
    const [style, setStyle] = useState("Modern");
    const [priceRange, setPriceRange] = useState("Mid-Range");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState("idea");
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState<
      false | "recognizing" | "translating" | "refining"
    >(false);
    const recognitionRef = React.useRef<any>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);
    const mediaStreamRef = React.useRef<MediaStream | null>(null);
    const rafRef = React.useRef<number | null>(null);
    const [waveform, setWaveform] = useState<number[]>(() => Array.from({ length: 12 }, () => 2));

    const cleanupAudio = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      try { mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}
      mediaStreamRef.current = null;
      try { analyserRef.current?.disconnect(); } catch {}
      analyserRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
    };

    const animateWaveform = () => {
      const analyser = analyserRef.current;
      const ctx = audioContextRef.current;
      if (!analyser || !ctx) return;
      const buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        const v = (buffer[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buffer.length);
      const volume = Math.min(1, Math.max(0, rms * 2.5));
      setWaveform((prev) => {
        const now = performance.now() / 1000;
        const baseIdle = 2;
        const maxHeight = 18;
        const next = prev.map((h, i) => {
          const phase = i * 0.35;
          const idlePulse = baseIdle + Math.sin(now * 2 + phase) * 1;
          const target = volume > 0.02
            ? baseIdle + (0.2 + Math.sin(now * 8 + phase) * 0.1 + volume) * maxHeight
            : idlePulse;
          return h + (target - h) * 0.2;
        });
        return next;
      });
      rafRef.current = requestAnimationFrame(animateWaveform);
    };

    const startListening = () => {
      try {
        const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
          alert("Speech recognition is not supported in this browser.");
          return;
        }
        const recognition = new SR();
        recognition.lang = "auto";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let finalTranscript = "";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalTranscript += transcript + " ";
            else interim += transcript;
          }
          setIdeaText((finalTranscript + interim).trim());
        };
        recognition.onerror = () => {
          setIsListening(false);
          setIsProcessing(false);
          cleanupAudio();
        };
        recognition.onend = () => {
          setIsListening(false);
          if (finalTranscript.trim()) {
            setIsProcessing("recognizing");
            setTimeout(() => setIsProcessing("translating"), 600);
            setTimeout(() => setIsProcessing("refining"), 1200);
            setTimeout(() => {
              const refined = finalTranscript
                .trim()
                .replace(/\s+/g, " ")
                .replace(/^\w/, (c) => c.toUpperCase());
              setIdeaText(refined);
              setIsProcessing(false);
            }, 2000);
          }
          let frames = 0;
          const decay = () => {
            frames++;
            setWaveform((prev) => prev.map((h) => h + (2 - h) * 0.15));
            if (frames < 12) requestAnimationFrame(decay);
            else cleanupAudio();
          };
          requestAnimationFrame(decay);
        };

        recognitionRef.current = recognition;
        recognition.start();

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          mediaStreamRef.current = stream;
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = ctx as AudioContext;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 1024;
          analyser.smoothingTimeConstant = 0.85;
          analyserRef.current = analyser;
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          animateWaveform();
        }).catch(() => {});
      } catch (e) {
        setIsListening(false);
        setIsProcessing(false);
        cleanupAudio();
      }
    };

    const stopListening = () => {
      try {
        recognitionRef.current?.stop?.();
      } finally {
        setIsListening(false);
      }
    };

    // Reset form when modal opens
    React.useEffect(() => {
      if (showNewProjectModal) {
        setIdeaText("");
        setCategory("Clothing");
        setStyle("Modern");
        setPriceRange("Mid-Range");
        setSelectedFile(null);
        setActiveTab("idea");
      }
    }, [showNewProjectModal]);

    return (
      <Dialog open={showNewProjectModal} onOpenChange={resetNewProjectForm}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Transform your business idea into a comprehensive launch-ready
              plan
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="idea">Start from Idea</TabsTrigger>
              <TabsTrigger value="design">Start from Design</TabsTrigger>
            </TabsList>

            <TabsContent value="idea" className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Describe your idea:
                </label>
                <div className="relative mt-1">
                  <textarea
                    className="w-full p-3 pr-12 border border-border rounded-md resize-none"
                    rows={3}
                    placeholder={
                      isListening
                        ? "Listening... feel free to speak in any language."
                        : "e.g., Eco-friendly t-shirt brand for young professionals"
                    }
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                  />

                  <button
                    type="button"
                    aria-label={isListening ? "Stop recording" : "Start recording"}
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-2 bottom-2 inline-flex items-center justify-center h-8 w-8 rounded-full border ${
                      isListening ? "border-red-300 bg-red-50" : "border-border bg-background"
                    }`}
                  >
                    {isListening ? (
                      <Square className="h-4 w-4 text-red-500 animate-pulse" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>

                  {isListening && (
                    <div className="absolute left-3 bottom-2 flex items-end gap-1 h-8">
                      <span className="sr-only">Listening waveform</span>
                      {waveform.map((h, i) => (
                        <div key={i} className="w-1 bg-primary/70 rounded-sm" style={{ height: Math.max(2, Math.min(22, h)) }} />
                      ))}
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isProcessing === "recognizing" && "🔊 Recognizing Speech..."}
                    {isProcessing === "translating" && "🌐 Translating to English..."}
                    {isProcessing === "refining" && "✨ Refining Idea..."}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">
                  Optional Tags (helps improve AI results):
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Category:
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      aria-label="Category"
                    >
                      <option>Clothing</option>
                      <option>Food & Beverage</option>
                      <option>Technology</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Style:
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded text-sm"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      aria-label="Style"
                    >
                      <option>Modern</option>
                      <option>Retro</option>
                      <option>Minimalist</option>
                      <option>Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Price:
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded text-sm"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      aria-label="Price Range"
                    >
                      <option>Budget</option>
                      <option>Mid-Range</option>
                      <option>Premium</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag & drop your design here, or click to browse
                </p>
                <input
                  type="file"
                  id="design-upload"
                  accept="image/*,.pdf,.ai,.psd"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                  className="hidden"
                  aria-label="Upload design file"
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('design-upload')?.click()}
                >
                  Choose File
                </Button>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetNewProjectForm}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (activeTab === "idea") {
                  handleCreateProject(ideaText);
                } else {
                  handleCreateProject(selectedFile ? `Design-based project: ${selectedFile.name}` : "Design project");
                }
              }}
              disabled={
                (activeTab === "idea" && !ideaText.trim()) || 
                (activeTab === "design" && !selectedFile) || 
                isCreatingProject
              }
              title={
                activeTab === "idea" 
                  ? (!ideaText.trim() ? "Please enter your business idea" : "Create project from idea")
                  : (!selectedFile ? "Please select a design file" : "Create project from design")
              }
            >
              {isCreatingProject ? "Creating..." : "Create Project"} 
              {!isCreatingProject && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  function EditProjectModal() {
    const [name, setName] = useState(editingProject?.name || "");
    const [description, setDescription] = useState(editingProject?.description || "");
    const [status, setStatus] = useState<"draft" | "active" | "completed">(editingProject?.status || "draft");
    const [progress, setProgress] = useState(editingProject?.progress || 0);

    const handleSave = () => {
      if (editingProject) {
        const updatedProject: Project = {
          ...editingProject,
          name,
          description,
          status,
          progress,
          lastModified: new Date().toISOString().split("T")[0],
        };
        handleUpdateProject(updatedProject);
      }
    };

    return (
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details and progress.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 p-3 border border-border rounded-md resize-none"
                rows={3}
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "active" | "completed")}
                  className="w-full mt-1 p-2 border border-border rounded text-sm"
                  aria-label="Project Status"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NewProjectModal />
      <EditProjectModal />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{projectToDelete?.name}" and remove it from your projects list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="pt-10 pb-8">
        <div className="container mx-auto px-4">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">Project created successfully!</span>
            </div>
          )}
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      project.status === "active" ? "default" : 
                      project.status === "completed" ? "secondary" : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span>Created: {project.createdAt}</span>
                  <span>Modified: {project.lastModified}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenProject(project)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteProject(project)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first project
              </p>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
