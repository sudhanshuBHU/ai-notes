"use client";

import { AlignLeft, Plus, CirclePause, CirclePlay, Download, Files, Layers, MoveDiagonal, NotebookPen, PencilLineIcon, Search, SlidersHorizontal, Star, Users, ArrowDownAZ, ArrowDownZA, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../components/side-bar"
import { NoteCard } from "../components/note-card"
import { RecordingBar } from "../components/recording-bar"
import Modal from "../components/card";
import ImageCard from "../components/imageCard";
import TiptapEditor from "../components/editor";
import RecordingOn from "../components/RecordingOn";
import { useRouter } from "next/navigation";
import { Note } from '@/types/dataTypes';
import UpdateTitle from "../components/UpdateTitle";
import toast from "react-hot-toast";



export default function Dashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalClickedBtn, setModalClickedBtn] = useState('left');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditorOn, setIsEditorOn] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Note[]>([]);
  const [data, setData] = useState<Note[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [seacrhText, setSearchText] = useState("");
  const [sortingOptionOn, setSortingOptionOn] = useState(false);
  const router = useRouter();
  const [chanheTitleModal, setChangeTitleModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [images, setImages] = useState<(string | null)[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");


  const closeEditor = () => setIsEditorOn(false);
  const closeModal = () => setModalOpen(false);

  const play = (transcript: string) => {
    const utterance = new SpeechSynthesisUtterance(transcript);
    // console.log(utterance);
    speechSynthesis.speak(utterance);
    setIsPlaying(false);
  }
  const playAndDownload = (text: string) => {
    // initialize the utterance
    const utterance = new SpeechSynthesisUtterance(text);
    const mediaStream = new MediaStream();
    // let mediaRecorder: MediaRecorder;
    const audioChunks: BlobPart[] = [];

    // Create an audio context
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    // const source = audioContext.createMediaStreamSource(destination.stream);
    mediaStream.addTrack(destination.stream.getAudioTracks()[0]);

    // Start recording
    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }

      // Create download link
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "speech.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    mediaRecorder.start();
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      mediaRecorder.stop();
    };
  };

  // fetching all notes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('tars_token');
    const user = localStorage.getItem('tars_userId');
    // console.log("from dashboard: ", token, user);

    if (!token || !user) {
      toast.error('Please login to continue');
      router.push('/login');
    }
    getNotes();
  }, [router]);

  async function getNotes() {
    try {
      const token = localStorage.getItem('tars_token');
      const userId = localStorage.getItem('tars_userId') || '';
      const res = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userId': userId,
          'Authorization': `Bearer ${token}`
        }
      });
      const dataRes = await res.json();
      // console.log(data);
      setDataset(dataRes.notes);
      setData(dataRes.notes);
      toast.success("Notes loaded successfully");
    } catch (error) {
      console.log(error);
    }
  }


  // handles search function
  useEffect(() => {
    const filteredData: Note[] = dataset.filter((item: Note) => {
      return item.title.toLowerCase().includes(seacrhText.toLowerCase()) || item.description.toLowerCase().includes(seacrhText.toLowerCase());
    });
    setDataset(filteredData);
    // console.log("from search");

  }, [seacrhText]);

  // handle sort function
  const sortData = (sortingCode: number) => {
    const sortedData: Note[] = dataset.sort((a: Note, b: Note) => {
      return sortingCode === 1 ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt);
    });
    setDataset(sortedData);
    setSortingOptionOn(false);
  }

  // handle favourite function do/undo favourite
  const handleFavourite = () => {
    try {
      const token = localStorage.getItem('tars_token');
      const noteId = dataset[selectedIndex]._id;
      const favorite = !dataset[selectedIndex].favorite;
      fetch(`${process.env.BASE_URL}/api/dashboard/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ noteId, favorite })
      }).then(() => {
        toast.success('Favourite updated successfully');
        getNotes();
      });

    } catch (error) {
      toast.error('Error updating favourite');
      console.log(error);
    }
  }
  // hnadle delete function
  const handleDelete = async () => {
    const token = localStorage.getItem('tars_token');
    await fetch('/api/dashboard', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ noteId: dataset[selectedIndex]._id })
    })
      .then(() =>{
        toast.success('Note deleted successfully');
        getNotes();
        closeModal();
      })
      .catch(err => {
        toast.error('Error deleting note');
        console.log(err);
      });
  }

  // add image to the existing note
  const addImage = async () => {
    const token = localStorage.getItem('tars_token');
    const formData = new FormData();
    formData.append('image', imageFile as Blob);
    await fetch(`${process.env.BASE_URL}/api/dashboard/addImage/${dataset[selectedIndex]._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    toast.success('Image added successfully');
    getNotes();
    setImageSrc('');
    setImageFile(null);
  }

  // extracting all images to avoid require() in the render and date to avoid hydration error
  useEffect(() => {
    // console.log("from image");

    const loadImages = async () => {
      if (!dataset[selectedIndex]?.image) return;
      const loadedImages = await Promise.all(
        dataset[selectedIndex]?.image.map(async (item) => {
          if (item === '') return null;
          const imageModule = await import(`@/uploads/${item}`);
          return imageModule.default || imageModule;
        })
      );
      setImages(loadedImages);
    };

    loadImages();
    // dates
    if (dataset[selectedIndex]?.updatedAt) {
      setFormattedDate(
        new Date(dataset[selectedIndex]?.updatedAt).toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      );
    }
  }, [selectedIndex]);

  useEffect(() => {
    // console.log("from empty");

    if (dataset.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [dataset.length]);

  return (
    <div className="flex h-screen w-full">

      {/* sidebar */}
      <div className="pl-4 pr-4 pb-4 pt-3">
        <Sidebar dataset={dataset} setDataset={setDataset} data={data} />
      </div>

      {/* side- bar */}
      <div className="w-full">

        {/* Search Bar */}
        <div className="flex items-center justify-between p-4 mt-2">

          <Search className="absolute ml-3" size={18} />
          <input placeholder="Search" className="pl-10 w-full mr-4 h-10 rounded-full border" onChange={(e) => setSearchText(e.target.value)} />

          <div className="flex flex-col relative">

            <button className="flex gap-2 justify-center items-center rounded-full border bg-gray-200 h-8 w-24"
              onClick={() => setSortingOptionOn(!sortingOptionOn)}>
              <SlidersHorizontal size={16} />
              Sort
            </button>
            {
              sortingOptionOn &&
              <div className="absolute flex flex-col gap-2 bg-white border rounded-lg p-2 mt-10">
                <div className="flex cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => sortData(1)}>
                  Date <ArrowDownAZ /></div>
                <div className="flex cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => sortData(2)}>
                  Date <ArrowDownZA /></div>
              </div>
            }
          </div>
        </div>

        {/* Notes  and message no notes available*/}
        <div className="flex flex-wrap p-4 h-[75%] overflow-y-scroll">
          {/* message for Emptiness */}
          {isEmpty &&
            <div className="flex flex-col justify-center items-center h-[75%] text-2xl text-gray-400">
              <div className="">No Notes Available</div>
              <div>Record Your First Note with Voice</div>
            </div>
          }
          {dataset?.map((item, index) => {
            return <div key={index} className="mr-4 mb-4">
              <NoteCard
                setDataset={setDataset}
                openModal={() => { setModalOpen(true); setSelectedIndex(index) }}
                title={item.title}
                timestamp={item.updatedAt}
                duration={item.audioLength}
                content={item.description}
                type={item.type}
                imageCount={item.image.length}
                noteId={item._id}
              />
            </div>

          })}
        </div>



        {/* Recording Bar */}
        <div className="absolute bottom-4 w-[60%] rounded-full border border-slate-400 ml-7">
          <RecordingBar openModal={() => setIsRecordingModalOpen(true)} />
        </div>
      </div>

      {/* Modal preview of card */}
      <Modal show={isModalOpen} fullScreen={fullScreen}>
        <div className="flex justify-between">
          <div className="rounded-full bg-slate-100 pl-2 pr-2 cursor-pointer" onClick={() => setFullScreen(!fullScreen)}><MoveDiagonal className="mt-2" size={18} /></div>
          <div className="flex justify-center items-center gap-3">
            <div className="rounded-full bg-slate-100 p-2 cursor-pointer" onClick={handleFavourite}><Star fill={dataset[selectedIndex]?.favorite ? 'black' : 'none'} size={18} /></div>
            <div>
              <button className="rounded-full bg-slate-100 p-2" onClick={handleDelete}><Trash2 size={16} /></button>
            </div>
            <div onClick={closeModal} className="text-gray-500 text-2xl hover:text-gray-700 rounded-full bg-slate-100 pl-2 pr-2 cursor-pointer">&times;</div>
          </div>
        </div>
        {/* title date and time */}
        <div className="flex mt-8">
          <div className="font-bold text-2xl">{dataset[selectedIndex]?.title}</div>
          <button className="ml-4" onClick={() => setChangeTitleModal(true)}><PencilLineIcon size={14} /></button>
        </div>
        <div className="text-gray-400 text-sm">
          {formattedDate}
        </div>

        {/* music player */}
        {/* {dataset[selectedIndex].type === 'audio' && */}
        <div className="mt-4 flex item-center ml-2 gap-4 border-t border-b pt-3  pb-1">
          {/* play pause btn */}
          <div>
            {
              isPlaying ? (
                <button onClick={() => { setIsPlaying(false) }} className=" rounded-full">
                  <CirclePause size={20} />
                </button>
              ) : (
                <button onClick={() => { setIsPlaying(true); play(dataset[selectedIndex]?.description) }} className=" rounded-full">
                  <CirclePlay size={20} />
                </button>
              )
            }
          </div>
          {/* progress bar */}
          <div className="w-[60%] bg-gray-200 h-1 rounded-full mt-2">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: "50%" }}></div>
          </div>

          {/* duration */}
          <div className="text-sm text-gray-500">00:00 / 01:00</div>

          {/* download btn */}
          <div className="">
            {/* <button onClick={() => playAndDownload("Hello! This is your transcript in audio format.")} className="bg-slate-100 rounded-lg text-xs flex gap-2 pl-2 pr-2 pt-1 pb-1"> */}
            <button onClick={() => playAndDownload(dataset[selectedIndex]?.description)} className="bg-slate-100 rounded-lg text-xs flex gap-2 pl-2 pr-2 pt-1 pb-1">
              <Download size={14} /> Download audio
            </button>
          </div>

        </div>
        {/* } */}

        {/* all four buttons */}
        <div className="mt-4 flex gap-3 rounded-full bg-gray-100 p-2 w-fit">
          <button onClick={() => { setModalClickedBtn('notes') }} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "notes" ? 'bg-gray-200' : ''}`}><NotebookPen className="mt-1" size={14} /> &nbsp;Notes</button>
          <button onClick={() => setModalClickedBtn('left')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "left" ? 'bg-gray-200' : ''}`}><AlignLeft className="mt-1" size={14} />&nbsp;Transcript</button>
          <button onClick={() => setModalClickedBtn('layers')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "layers" ? 'bg-gray-200' : ''}`}><Layers className="mt-1" size={14} />&nbsp;Create</button>
          <button onClick={() => setModalClickedBtn('users')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "users" ? 'bg-gray-200' : ''}`}><Users className="mt-1" size={14} />&nbsp;Speaker Transcript</button>
        </div>

        {/* description */}
        <div className="border rounded-lg mt-4 p-2">
          <div className=" flex justify-between pl-3 pr-3 ">
            <div className="font-bold">Transcript</div>
            <div className="flex text-sm gap-1 bg-gray-100 rounded-full pl-2 pr-2 pt-1 pb-1 text-gray-400 cursor-pointer" onClick={() => navigator.clipboard.writeText(dataset[selectedIndex].description)}><Files size={16} /> Copy</div>
          </div>

          <div className="pl-3 pr-3 text-sm">{dataset[selectedIndex]?.description.length > 200 ? dataset[selectedIndex]?.description.slice(0, 200) + '...' : dataset[selectedIndex]?.description}</div>
          <button className="pl-3 underline text-sm text-gray-400 mt-3" onClick={() => setIsEditorOn(true)}>Read More</button>
        </div>

        {/* displaying images */}
        <div className="mt-4 overflow-y-scroll h-[22%] overflow-x-scroll w-[63%] pt-2 pl-3 pr-3 absolute flex flex-wrap gap-2">

          {/* require(`@/uploads/${dataset[selectedIndex]?.image[0]}`) */}
          {/* {dataset[selectedIndex]?.image.map((item, index) => {
            if (item === '') return null;
            return <div key={index}><ImageCard src={require(`@/uploads/${item}`)} noteId={dataset[selectedIndex]._id} deleteIdx={index} setDataset={setDataset} /></div>
          })
          } */}

          {images && images.map((src, index) => {
            if (!src) return null;
            return (
              <div key={index}>
                <ImageCard
                  src={src}
                  noteId={dataset[selectedIndex]._id}
                  deleteIdx={index}
                  setDataset={setDataset}
                />
              </div>
            );
          })}


          {/* Image Upload Button */}
          {!imageSrc &&
            <button className="h-24 w-24 flex flex-col justify-center items-center gap-1 rounded-xl border-dashed border-2 relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setImageSrc(imageUrl);
                    setImageFile(file);
                    // console.log(imageUrl);
                  }
                }}
              />
              <Plus className="h-4 w-4" />
              <span className="text-xs font-normal">Image</span>
            </button>}

          {/* insert image */}
          {imageSrc &&
            <div className="">
              {/* <img src={imageSrc} alt="Uploaded" className="max-w-24 max-h-24 rounded-lg" /> */}
              <ImageCard setDataset={setDataset} src={imageSrc} noDelete="temp" close={() => {
                setImageSrc(''); setImageFile(null);
              }} />
            </div>
          }
          {imageSrc &&
            <button className=" mb-2 text-blue-500 font-bold hover:text-blue-700" onClick={addImage}>Add Image</button>
          }
        </div>
      </Modal>

      {/* editor */}
      <div>
        <Modal show={isEditorOn}>
          <TiptapEditor closeEditor={closeEditor} dataset={dataset} setDataset={setDataset} index={selectedIndex} />
        </Modal>
      </div>

      {/* recording on Modal */}
      <div>
        <Modal show={isRecordingModalOpen}>
          <RecordingOn closeModal={() => setIsRecordingModalOpen(false)} setDataset={setDataset} />
        </Modal>
      </div>

      {/* change title modal */}
      <div>
        <Modal show={chanheTitleModal}>
          <UpdateTitle closeEditor={() => setChangeTitleModal(false)} dataset={dataset} index={selectedIndex} setDataset={setDataset} />
        </Modal>
      </div>
    </div>
  )
}















