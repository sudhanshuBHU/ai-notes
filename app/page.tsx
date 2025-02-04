"use client";

import { AlignLeft, Plus, CirclePause, CirclePlay, Download, Files, Layers, MoveDiagonal, NotebookPen, PencilLineIcon, Search, SlidersHorizontal, Star, Users } from "lucide-react";
import { Sidebar } from "./components/side-bar"
import { NoteCard } from "./components/note-card"
import { RecordingBar } from "./components/recording-bar"
import { useRef, useState } from "react";
import Modal from "./components/card";
import ImageCard from "./components/imageCard";
import TiptapEditor from "./components/editor";
import RecordingOn from "./components/RecordingOn";
import data from "./tempoData";

export default function Dashboard() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalClickedBtn, setModalClickedBtn] = useState('left');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditorOn, setIsEditorOn] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [originalText, setOriginalText] = useState("");

  const closeEditor = () => setIsEditorOn(false);
  const closeModal = () => setModalOpen(false);

  const modalhandler = (item: number) => {
    console.log(item);
    setModalOpen(true);

  }
  const play = (transcript: string) => {
    let utterance = new SpeechSynthesisUtterance(transcript);
    // console.log(utterance);
    speechSynthesis.speak(utterance);
  }
  const playAndDownload = (text: string) => {
    // initialize the utterance
    let utterance = new SpeechSynthesisUtterance(text);
    let mediaStream = new MediaStream();
    let mediaRecorder: MediaRecorder;
    let audioChunks: BlobPart[] = [];

    // Create an audio context
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const source = audioContext.createMediaStreamSource(destination.stream);
    mediaStream.addTrack(destination.stream.getAudioTracks()[0]);

    // Start recording
    mediaRecorder = new MediaRecorder(mediaStream);
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

  return (
    <div className="flex h-screen w-full">

      {/* sidebar */}
      <div className="pl-4 pr-4 pb-4 pt-3">
        <Sidebar />
      </div>


      <div className="w-full">

        {/* Search Bar */}
        <div className="flex items-center justify-between p-4 mt-2">
          {/* <div className="relative flex border border-blue-900 rounded-full flex items-center justify-between pl-2 w-full h-10"> */}
          <Search className="absolute ml-3" size={18} />
          <input placeholder="Search" className="pl-10 w-full mr-4 h-10 rounded-full border" />
          {/* </div> */}
          <button className="flex gap-2 justify-center items-center rounded-full border bg-gray-200 h-8 w-24">
            <SlidersHorizontal size={16} />
            Sort
          </button>
        </div>

        {/* Notes */}
        <div className="flex flex-wrap p-4 h-[75%] overflow-y-scroll">
          {arr.map((item) => {
            return <div key={item} className="mr-4 mb-4" onClick={() => modalhandler(item)}>
              <NoteCard
                title="Engineering Assignment Audio"
                timestamp="Jan 30, 2025 · 5:26 PM"
                duration="00:09"
                content="I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors. lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit."
                type="audio"
                imageCount={1}
              />
            </div>

          })}
        </div>

        {/* Recording Bar */}
        <div className="absolute bottom-4 w-[60%] rounded-full border border-slate-400 ml-7">
          <RecordingBar openModal={()=>setIsRecordingModalOpen(true)}/>
        </div>
      </div>

      {/* Modal preview of card */}
      <Modal show={isModalOpen} onClose={closeModal} title="Modal Title ">
        <div className="flex justify-between">
          <div className="rounded-full bg-slate-100 pl-2 pr-2 cursor-pointer"><MoveDiagonal className="mt-2" size={18} /></div>
          <div className="flex justify-center items-center gap-6">
            <div className="rounded-full bg-slate-100 p-2 cursor-pointer"><Star size={18} /></div>
            <div>
              <button className="rounded-full bg-slate-100 pl-3 pr-3 pt-1 pb-1">Share</button>
            </div>
            <div onClick={closeModal} className="text-gray-500 text-2xl hover:text-gray-700 rounded-full bg-slate-100 pl-2 pr-2 cursor-pointer">&times;</div>
          </div>
        </div>
        {/* title date and time */}
        <div className="flex mt-8">
          <div className="font-bold text-2xl">Title</div>
          <button className="ml-4"><PencilLineIcon size={14} /></button>
        </div>
        <div className="text-gray-400 text-sm">
          Jan 30, 2025 · 5:26 PM
        </div>

        {/* music player */}
        <div className="mt-4 flex item-center ml-2 gap-4 border-t border-b pt-3  pb-1">
          {/* play pause btn */}
          <div>
            {
              isPlaying ? (
                <button onClick={() => { setIsPlaying(false); play("Hello! This is your transcript in audio format.") }} className=" rounded-full">
                  <CirclePause size={20} />
                </button>
              ) : (
                <button onClick={() => { setIsPlaying(true); play("Hello! This is your transcript in audio format.") }} className=" rounded-full">
                  <CirclePlay size={20} />
                </button>
              )
            }
          </div>
          {/* progress bar */}
          <div className="w-[60%] bg-gray-200 h-2 rounded-full mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
          </div>

          {/* duration */}
          <div className="text-sm text-gray-500">00:00 / 01:00</div>

          {/* download btn */}
          <div className="">
            <button onClick={() => playAndDownload("Hello! This is your transcript in audio format.")} className="bg-slate-100 rounded-lg text-xs flex gap-2 pl-2 pr-2 pt-1 pb-1">
              <Download size={14} /> Download audio
            </button>
          </div>

        </div>

        {/* all four buttons */}
        <div className="mt-4 flex gap-3 rounded-full bg-gray-100 p-2 w-fit">
          <button onClick={() => { setModalClickedBtn('notes') }} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "notes" ? 'bg-gray-200' : ''}`}><NotebookPen className="mt-1" size={14} /> &nbsp;Notes</button>
          <button onClick={() => setModalClickedBtn('left')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "left" ? 'bg-gray-200' : ''}`}><AlignLeft className="mt-1" size={14} />&nbsp;Transcript</button>
          <button onClick={() => setModalClickedBtn('layers')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "layers" ? 'bg-gray-200' : ''}`}><Layers className="mt-1" size={14} />&nbsp;Create</button>
          <button onClick={() => setModalClickedBtn('users')} className={`flex text-sm rounded-full hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 ${modalClickedBtn === "users" ? 'bg-gray-200' : ''}`}><Users className="mt-1" size={14} />&nbsp;Speaker Transcript</button>
        </div>
        <div className="border rounded-lg mt-4 p-2">
          <div className=" flex justify-between pl-3 pr-3 ">
            <div className="font-bold">Transcript</div>
            <div className="flex text-sm gap-1 bg-gray-100 rounded-full pl-2 pr-2 pt-1 pb-1 text-gray-400"><Files size={16} /> Copy</div>
            {/* details // isme container v ahi // read more copy button v dalna hai */}

          </div>
          <div className="pl-3 pr-3 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quasi dolore neque mollitia laboriosam accusamus laudantium natus eligendi corporis, ut vel enim a molestias provident minima, similique ea eveniet magnam?</div>
          <button className="pl-3 underline text-sm text-gray-400" onClick={() => setIsEditorOn(true)}>Read More</button>
        </div>
        <div className="mt-4 overflow-y-scroll h-[22%] overflow-x-scroll w-[63%] pt-2 pl-3 pr-3 absolute flex flex-wrap gap-2">
          {arr.map((item) => {
            return <div key={item}><ImageCard /></div>
          })}
          {/* Image Upload Button */}
          <button className="h-24 w-24 flex flex-col justify-center items-center gap-1 rounded-xl border-dashed border-2">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle the file input
                  console.log(file);
                }
              }}
            />
            <Plus className="h-4 w-4" />
            <span className="text-xs font-normal">Image</span>
          </button>
        </div>
      </Modal>

      {/* editor */}
      <div>
        <Modal show={isEditorOn} onClose={closeEditor} title="Editor Title ">
          <TiptapEditor closeEditor={closeEditor} />
        </Modal>
      </div>

      {/* recording on Modal */}
      <div>
        <Modal show={isRecordingModalOpen} title="Recording Zone">
          <RecordingOn closeModal={()=>setIsRecordingModalOpen(false)} setOriginalText={setOriginalText} originalText={originalText} />
        </Modal>
      </div>
    </div>
  )
}















